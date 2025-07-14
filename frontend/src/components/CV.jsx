import React from 'react';
import { Calendar, MapPin, Phone, Mail, Globe, Award, BookOpen, Briefcase, User, Code, Heart, Languages } from 'lucide-react';

const CV = ({ data }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const formatDateRange = (startDate, endDate) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Present';
    return `${start} - ${end}`;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{data.fullname}</h1>
            {data.apply_job && (
              <p className="text-blue-100 text-lg font-medium">{data.apply_job}</p>
            )}
          </div>
          <div className="space-y-2 text-sm">
            {data.email && (
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{data.phone}</span>
              </div>
            )}
            {data.address && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{data.address}</span>
              </div>
            )}
            {data.dob && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{formatDate(data.dob)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary Section */}
        {data.summary && (
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Professional Summary</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experience Section */}
            {data.experiences && data.experiences.length > 0 && (
              <section>
                <div className="flex items-center mb-6">
                  <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">Work Experience</h2>
                </div>
                <div className="space-y-6">
                  {data.experiences.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-6 pb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                        <span className="text-sm text-gray-500 font-medium">
                          {formatDateRange(exp.startDate, exp.endDate)}
                        </span>
                      </div>
                      <p className="text-blue-600 font-medium mb-3">{exp.company}</p>
                      <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section */}
            {data.projects && data.projects.length > 0 && (
              <section>
                <div className="flex items-center mb-6">
                  <Code className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">Projects</h2>
                </div>
                <div className="space-y-6">
                  {data.projects.map((project, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">{project.projectName}</h3>
                        <span className="text-sm text-gray-500 font-medium">
                          {formatDateRange(project.projectStartDate, project.projectEndDate)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{project.projectDescription}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Education Section */}
            {data.educations && data.educations.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-800">Education</h2>
                </div>
                <div className="space-y-4">
                  {data.educations.map((edu, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                      <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                      <p className="text-blue-600 font-medium">{edu.school}</p>
                      <p className="text-sm text-gray-500">
                        {formatDateRange(edu.startDate, edu.endDate)}
                      </p>
                      {edu.gpa && (
                        <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills Section */}
            {(data.skills.primarySkills.length > 0 || data.skills.softSkills.length > 0) && (
              <section>
                <div className="flex items-center mb-4">
                  <Code className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-800">Skills</h2>
                </div>
                
                {data.skills.primarySkills.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Technical Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.primarySkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {data.skills.softSkills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Soft Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.softSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Certificates Section */}
            {data.certificates && data.certificates.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <Award className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-800">Certifications</h2>
                </div>
                <div className="space-y-3">
                  {data.certificates.map((cert, index) => (
                    <div key={index} className="border-l-4 border-green-200 pl-4">
                      {cert.link ? (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {cert.name}
                        </a>
                      ) : (
                        <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                      )}
                      <p className="text-sm text-gray-500">
                        {formatDateRange(cert.startDate, cert.endDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages Section */}
            {data.languages && data.languages.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <Languages className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-800">Languages</h2>
                </div>
                <div className="space-y-2">
                  {data.languages.map((lang, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{lang.name}</span>
                      {lang.certificate && (
                        <span className="text-sm text-gray-600">{lang.certificate}</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CV;